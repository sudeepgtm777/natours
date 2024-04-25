const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handleFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

/****** The use of factory model to getAllUser. *******/
exports.getAllUsers = factory.getAll(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create Error if user Post password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update!!. Please use updatePassword',
        400,
      ),
    );
  }

  // 2) Filtering unwanted fields that are not updated.
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update the document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'Success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/****** The use of factory model to getUser. *******/
exports.getUser = factory.getOne(User);

/****** There is no need to make one fore createUser as we signup for that purpose. *******/
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined Please use signup Instead!!',
  });
};

/****** The use of factory model to update User. *******/
// Do not update password with this
exports.updateUser = factory.updateOne(User);

/****** The use of factory model to delete User. *******/
exports.deleteUser = factory.deleteOne(User);
