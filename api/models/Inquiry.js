'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Inquiry extends Model {
    static associate(models) {
      // define association here
    }
  }

  Inquiry.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Invalid email format',
        },
        notEmpty: true,
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 5000],
      },
    },
    status: {
      type: DataTypes.ENUM('unseen', 'seen', 'replied'),
      allowNull: false,
      defaultValue: 'unseen',
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    sequelize,
    modelName: 'Inquiry',
    tableName: 'inquiries',
    timestamps: true,
    underscored: true,
  });

  return Inquiry;
};
