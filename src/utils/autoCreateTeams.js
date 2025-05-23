import Team from "../models/team.model.js";
import Project from "../models/project.model.js";
import { sendTeamInvites } from "../controllers/inviteController.js";
import { generateUniqueName } from "../services/uniqueNameGenerator.js";

export const autoCreateTeams = async ({
  emailArray,
  project,
  invitedByUserId,
}) => {
  const { maxTeams, maxMembersPerTeam, _id: projectId, guildId } = project;

  let teamsCreated = [];
  let teamCounter = 1;
  let emailIndex = 0;

  while (emailIndex < emailArray.length && teamsCreated.length < maxTeams) {
    const teamEmails = emailArray.slice(emailIndex, emailIndex + maxMembersPerTeam);
    const teamName = generateUniqueName();

    const newTeam = new Team({
      name: teamName,
      projectId,
      members: [],
      discord: {
        guildId,
      },
    });

    await newTeam.save();

    // Push new team ID to project
    await Project.findByIdAndUpdate(projectId, {
      $push: { teams: newTeam._id },
    });

    // Send invites
    await sendTeamInvites(teamEmails, projectId, newTeam._id, invitedByUserId);

    teamsCreated.push(newTeam);
    emailIndex += maxMembersPerTeam;
    teamCounter++;
  }

  return teamsCreated;
};
