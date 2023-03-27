const model = require("../models");
const sequelize = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

module.exports = {
    // get property
    getAllProperty: async (req, res, next) => {
        try {
            let get = await model.property.findAll({
                where: {
                    isDeleted: false,
                },
            });
            console.log("get all properties:", get);
            return res.status(200).send({
                success: true,
                data: get,
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    // create property
    addProperty: async (req, res, next) => {
        try {
            console.log("req.body.data", req.body.data);
            console.log("req.files", req.files);
            let { property, address, description, category, userId } =
                JSON.parse(req.body.data);
            if (req.files.length === 0) {
                let add = await model.property.create({
                    uuid: uuidv4(),
                    property,
                    address,
                    description,
                    categoryId: category,
                    userId: userId,
                });
                console.log("Data Property:", add);
                return res.status(200).send({
                    success: true,
                    message: "Added new property",
                });
            } else {
                let add = await model.property.create({
                    uuid: uuidv4(),
                    property,
                    address,
                    description,
                    categoryId: category,
                    userId: userId,
                    picture: `/picProperty/${req.files[0]?.filename}`,
                });
            }
            return res.status(200).send({
                success: true,
                message: "Added new property",
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    // edit property
    editProperty: async (req, res, next) => {
        try {
            let get = await model.property.findAll({
                where: { uuid: req.params.uuid },
                attributes: ["image"],
            });
            console.log("req.body.data", req.body.data);
            console.log("req.files", req.files);
            let { property, address, description, category, userId } =
                JSON.parse(req.body.data);
            if (req.files.length === 0) {
                let edit = await model.property.update(
                    {
                        property,
                        address,
                        description,
                        categoryId: category,
                        userId: userId,
                    },
                    {
                        where: {
                            uuid: req.params.uuid,
                        },
                    }
                );
                console.log("Data edit:", edit);
                return res.status(200).send({
                    success: true,
                    message: "Property updated",
                });
            } else {
                await model.property.update(
                    {
                        property,
                        address,
                        description,
                        categoryId: category,
                        userId: userId,
                        picture: `/picProperty/${req.files[0]?.filename}`,
                    },
                    {
                        where: {
                            uuid: req.params.uuid,
                        },
                    }
                );
                if (
                    fs.existsSync(`./src/public${get[0].dataValues.picture}`) &&
                    !get[0].dataValues.picture.includes("default")
                ) {
                    fs.unlinkSync(`./src/public${get[0].dataValues.picture}`);
                }
            }
            return res.status(200).send({
                success: true,
                message: "Edit Product Success",
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    // delete property
    deleteProperty: async (req, res, next) => {
        try {
            let del = await model.property.update(
                {
                    isDeleted: true,
                },
                {
                    where: {
                        uuid: req.body.uuid,
                    },
                }
            );
            res.status(200).send({
                success: true,
                message: "Property Deleted",
                data: del,
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
};
