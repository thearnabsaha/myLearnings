import { google } from "googleapis";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const getAuth = async (email: string) => {
    const userByName = await prisma.user.findFirst({
        where: {
            email: email
        },
    })
    if (userByName) {
        const account = await prisma.account.findFirst({
            where: {
                userId: userByName.id
            },
        })
        if (account) {
            const oAuth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET
            );

            oAuth2Client.setCredentials({
                access_token: account.access_token,
                refresh_token: account.refresh_token,
            });
            return oAuth2Client
        }
    }
}
export const getCalenderEvents = async (email: string) => {
    const auth = await getAuth(email)
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
    });
    const data = res.data.items?.map((e) => ({
        id: e.id,
        summary: e.summary,
        status: e.status,
        organiser: e.organizer,
        start: e.start,
        end: e.end,
        attendees: e.attendees,
        meetingLink: e.hangoutLink,
        eventType: e.eventType,
    }));
    return JSON.stringify(data)
}