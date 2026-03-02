function SocialLinks({ links }) {
  return (
    <div className="mt-4 space-y-2 text-sm">
      {links.website && <p>🌐 {links.website}</p>}
      {links.twitter && <p>🐦 {links.twitter}</p>}
      {links.linkedin && <p>💼 {links.linkedin}</p>}
    </div>
  );
}

export default SocialLinks;