export const baseUrl = "http://localhost:4000";
export const apiUrls = {
    uploadPdf: `${baseUrl}/upload`,
    getParsedData: `${baseUrl}/getparseddata/:id`,
    getJobStatus: `${baseUrl}/get_job_status/:id`,
    sendUserChat: `${baseUrl}/send_user_chat`,
    pingGemini: `${baseUrl}/ping_gemini`,
}