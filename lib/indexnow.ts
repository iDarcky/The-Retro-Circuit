export const INDEXNOW_API_KEY = "e0fa4fa524524cc9977e34474132ea62";
export const INDEXNOW_HOST = "theretrocircuit.com"; // Change this if different

export async function submitToIndexNow(urls: string[]) {
    if (!urls || urls.length === 0) return;

    try {
        const payload = {
            host: INDEXNOW_HOST,
            key: INDEXNOW_API_KEY,
            keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_API_KEY}.txt`,
            urlList: urls
        };

        const response = await fetch("https://api.indexnow.org/indexnow", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.warn(`[IndexNow] Failed to submit URLs. Status: ${response.status} ${response.statusText}`);
            const text = await response.text();
            if (text) console.warn(`[IndexNow] Response: ${text}`);
        } else {
            console.log(`[IndexNow] Successfully submitted ${urls.length} URL(s)`);
        }
    } catch (error: any) {
        console.warn(`[IndexNow] Exception during submission: ${error.message}`);
    }
}
