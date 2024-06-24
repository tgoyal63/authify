import { Response } from "express";
import { TypedRequestQuery } from "zod-express-middleware";
import client from "@/discord";
import { guildIdValidator } from "@/inputValidators/service.validators";
import { ApiHandler } from "@/utils/api-handler.util";
import { ControllerError } from "@/types/error/controller-error";

export const getAvailableRolesController = ApiHandler(
  async (
    req: TypedRequestQuery<typeof guildIdValidator.query>,
    res: Response
  ) => {
    const guildId = req.query.guildId as string;

    try {
      const guild = await client.guilds.fetch(guildId);

      if (!guild.members.me?.roles.highest) {
        throw new ControllerError("Bot is not in the guild", 400);
      }

      const botHighestRole = guild.members.me.roles.highest;
      const roles = guild.roles.cache.map((role) => {
        return {
          id: role.id,
          name: role.name,
          color: role.hexColor,
          icon: role.iconURL(),
          enabled:
            role.comparePositionTo(botHighestRole) < 0 &&
            !role.managed &&
            role.name !== "@everyone",
        };
      });

      res.send({
        success: true,
        data: roles,
        message: "Roles fetched successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).send({
          success: false,
          message: "An unknown error occurred",
        });
      }
    }
  }
);
