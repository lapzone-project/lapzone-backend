const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access Denied: You do not have the required permissions' });
    }
    
    next();
  };
};

export default checkRole;
