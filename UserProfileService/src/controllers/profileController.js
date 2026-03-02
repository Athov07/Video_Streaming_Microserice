import UserProfile from "../models/UserProfile.js";
import cloudinary from "../config/cloudinary.js";

// Automatically create a UserProfile when a new user signs up / logs in for the first time.
export const getOrCreateProfile = async (req, res, next) => {
  try {
    let profile = await UserProfile.findOne({ userId: req.user.id });

    if (!profile) {
      // Create new profile with default values
      profile = await UserProfile.create({
        userId: req.user.id,
        name: req.user.name || "New User",
      });
    }

    req.profile = profile; // pass to next middleware / route
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot create or fetch profile" });
  }
};

// Get own profile
export const getMyProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot fetch profile" });
  }
};

// Update profile (name, bio, socialLinks, profilePicture)
export const updateProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const { name, bio, socialLinks } = req.body;

    if (name) profile.name = name;
    if (bio) profile.bio = bio;
    
    if (socialLinks) {
      if (typeof socialLinks === "string") {
        try {
          profile.socialLinks = JSON.parse(socialLinks);
        } catch (error) {
          return res.status(400).json({ message: "Invalid socialLinks JSON" });
        }
      } else {
        profile.socialLinks = socialLinks; // already an object
      }
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures",
      });
      profile.profilePicture = result.secure_url;
    }

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot update profile" });
  }
};

// Follow user
// Unfollow user
export const toggleFollowUser = async (req, res) => {
  try {
    const targetProfile = await UserProfile.findById(req.params.userId);
    const myProfile = await UserProfile.findOne({ userId: req.user.id });

    if (!targetProfile || !myProfile)
      return res.status(404).json({ message: "User not found" });

    if (targetProfile._id.equals(myProfile._id))
      return res.status(400).json({ message: "Cannot follow yourself" });

    const isFollowing = myProfile.following.includes(targetProfile._id);

    if (isFollowing) {
      // Unfollow
      myProfile.following.pull(targetProfile._id);
      targetProfile.followers.pull(myProfile._id);
    } else {
      // Follow
      myProfile.following.push(targetProfile._id);
      targetProfile.followers.push(myProfile._id);
    }

    await myProfile.save();
    await targetProfile.save();

    res.json({
      isFollowing: !isFollowing,
      followersCount: targetProfile.followers.length,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot follow user" });
  }
};
