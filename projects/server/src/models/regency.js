"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class regency extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    regency.init(
        {
            name: DataTypes.STRING,
            province_id: DataTypes.STRING,
            alt_name: DataTypes.STRING,
            latitude: DataTypes.DOUBLE,
            longitude: DataTypes.DOUBLE,
        },
        {
            sequelize,
            modelName: "regency",
        }
    );
    return regency;
};
