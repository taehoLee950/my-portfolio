"use strict";
import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class ProjectImage extends Model {
    static associate(models) {
      // Project와의 관계 설정
      ProjectImage.belongsTo(models.Project, {
        foreignKey: "project_id",
        onDelete: "CASCADE",
      });

      // Project 모델에 hasMany 관계 추가
      models.Project.hasMany(ProjectImage, {
        foreignKey: "project_id",
        as: "images",
      });
    }
  }

  ProjectImage.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      project_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "projects", // 테이블 이름 직접 참조
          key: "id",
        },
        onDelete: "CASCADE",
      },
      image_url: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          notEmpty: true,
          // isUrl: {
          //   msg: 'Invalid URL format',
          // },
        },
      },
      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "ProjectImage",
      tableName: "project_images",
      timestamps: true,
      underscored: true,
    },
  );

  return ProjectImage;
};
