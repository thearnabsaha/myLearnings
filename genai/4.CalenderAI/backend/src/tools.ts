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
export const createCalenderEvents = async (email: string, start: any, end: any, attendees: any, summary: string, description: string, timezone: string) => {
    //   const event = {
    //     summary: 'Google I/O 2015',
    //     description: 'A chance to hear more about Googles developer products.',
    //     start: {
    //         dateTime: '2025-09-15T19:00:00+05:30', // Today at 7 PM IST
    //         timeZone: 'Asia/Kolkata',
    //     },
    //     end: {
    //         dateTime: '2025-09-15T20:00:00+05:30', // 1 hour duration
    //         timeZone: 'Asia/Kolkata',
    //     },

    //     attendees: [
    //         { email: 'hparnab0@gmail.com' },
    //     ],
    //     reminders: { useDefault: true },
    //     conferenceData: {
    //         createRequest: {
    //             requestId: crypto.randomUUID(),
    //             conferenceSolutionKey: { type: 'hangoutsMeet' },
    //         }
    //     }
    // };
    console.log(attendees, timezone)

    const event = {
        summary,
        description: description || "",
        start: {
            dateTime: start, // Today at 7 PM IST
            timeZone: timezone,
        },
        end: {
            dateTime: end, // 1 hour duration
            timeZone: timezone,
        },
        attendees: JSON.parse(attendees),
        reminders: { useDefault: true },
        conferenceData: {
            createRequest: {
                requestId: crypto.randomUUID(),
                conferenceSolutionKey: { type: 'hangoutsMeet' },
            }
        }
    };
    const auth = await getAuth(email)
    const calendar = google.calendar({ version: 'v3', auth });
    const response = await calendar.events.insert({
        calendarId: email,
        requestBody: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all'
    })
    return response;
}