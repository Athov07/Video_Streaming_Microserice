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
        email: req.user.email,
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
export const followUser = async (req, res) => {
  try {
    const userToFollow = await UserProfile.findById(req.params.userId);
    const me = await UserProfile.findOne({ userId: req.user.id });

    if (!userToFollow || !me)
      return res.status(404).json({ message: "User not found" });
    if (userToFollow._id.equals(me._id))
      return res.status(400).json({ message: "Cannot follow yourself" });

    if (!userToFollow.followers.includes(me._id)) {
      userToFollow.followers.push(me._id);
      me.following.push(userToFollow._id);
    }

    await userToFollow.save();
    await me.save();

    res.json({ message: `You are now following ${userToFollow.name}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot follow user" });
  }
};

// Unfollow user
export const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await UserProfile.findById(req.params.userId);
    const me = await UserProfile.findOne({ userId: req.user.id });

    if (!userToUnfollow || !me)
      return res.status(404).json({ message: "User not found" });

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => !id.equals(me._id),
    );
    me.following = me.following.filter((id) => !id.equals(userToUnfollow._id));

    await userToUnfollow.save();
    await me.save();

    res.json({ message: `You have unfollowed ${userToUnfollow.name}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot unfollow user" });
  }
};
