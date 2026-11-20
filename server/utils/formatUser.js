// Only send safe fields to the frontend (never the password)
module.exports = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});
