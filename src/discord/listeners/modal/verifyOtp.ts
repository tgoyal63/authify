import { GuildMemberRoleManager, ModalSubmitInteraction } from "discord.js";
import { updateDiscordIdForPhoneNumberandFetchRoles } from "../../../services/service.service";

import { verifyOtpForDiscordId } from "../../../utils/otp.utils";

export default async (
	interaction: ModalSubmitInteraction,
	serviceId: string,
	phone: string,
) => {
	try {
		await interaction.reply({
			content: "Verifying OTP...",
			ephemeral: true,
		});
		const otp = parseInt(interaction.fields.getTextInputValue("otp"));
		const validOtp = verifyOtpForDiscordId(interaction.user.id, otp);
		if (!validOtp) {
			await interaction.editReply({
				content: "Invalid OTP. Please try again.",
			});
			return;
		}
		await interaction.editReply({
			content: "OTP validated , assigning roles ...",
		});

		const roles = await updateDiscordIdForPhoneNumberandFetchRoles(
			serviceId,
			phone,
			interaction.user.id,
		);
		if (!roles) {
			await interaction.editReply({
				content: "No roles found for this phone number.",
			});
			return;
		}
		if (
			!interaction.member ||
			!(interaction.member.roles instanceof GuildMemberRoleManager)
		)
			throw new Error("Member not found");

		await interaction.member.roles.add(roles);
		await interaction.editReply({
			content: "Roles assigned successfully.",
		});
	} catch (error: any) {
		console.log(error);
	}
};
