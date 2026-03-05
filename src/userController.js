const { readifyUser_Collection } = require("./config");

exports.getMe = async (req, res, next) => {
	try {

		if (!req.session.userId) {
			return res.status(401).json({
				status: "fail",
				message: "Not logged in"
			});
		}

		const user = await readifyUser_Collection.findById(req.session.userId);
		
		if (!user) {
			return res.status(404).json({
				status: "fail",
				message: "User not found"
			});
		}

		res.status(200).json({
			status: "success",
			data: user
		});

	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: "error",
			message: "Server error"
		});
	}
};