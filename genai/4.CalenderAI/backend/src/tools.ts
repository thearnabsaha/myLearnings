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
    const event = {
        summary,
        description: description || "",
        start: {
            dateTime: start,
            timeZone: timezone,
        },
        end: {
            dateTime: end,
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
export const deleteCalenderEvents = async (email: string, eventid: string) => {
    const auth = await getAuth(email)
    const calendar = google.calendar({ version: "v3", auth });
    try {
        const calendarId = email;
        const eventId = eventid;

        await calendar.events.delete({
            calendarId,
            eventId,
        });

        console.log("✅ Event deleted successfully!");
    } catch (err) {
        console.error("❌ Error deleting event:", err);
    }
}
export const updateCalenderEvents = async (email: string, eventid: string, start: any, end: any, attendees: any, summary: string, description: string, timezone: string) => {
    const auth = await getAuth(email)
    const calendar = google.calendar({ version: "v3", auth });
    try {
        const calendarId = email;
        const eventId = eventid;
        // First get the existing event
        const event = await calendar.events.get({
            calendarId,
            eventId,
        });
        // Modify fields
        event.data.summary = summary;
        event.data.description = description;
        event.data.start = {
            dateTime: start,
            timeZone: timezone,
        };
        event.data.end = {
            dateTime: end,
            timeZone: timezone,
        };
        event.data.attendees = attendees
        // Update event
        const updatedEvent = await calendar.events.update({
            calendarId,
            eventId,
            requestBody: event.data,
        });
        console.log("✅ Event deleted successfully!");
    } catch (err) {
        console.error("❌ Error deleting event:", err);
    }
}