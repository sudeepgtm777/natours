exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with Id!!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: null,
    });
  });
