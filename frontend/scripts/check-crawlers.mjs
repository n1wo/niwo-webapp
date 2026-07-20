const baseUrl = (process.argv[2] ?? "https://www.niwosystems.com").replace(/\/$/, "");
const agents = ["Googlebot", "Bingbot", "OAI-SearchBot", "GPTBot", "ChatGPT-User"];
const paths = ["/robots.txt", "/en", "/de", "/en/topics/incident-response", "/de/topics/incident-response", "/en/services/incident-response-guidance", "/de/services/incident-response-guidance"];
let failed = false;
for (const agent of agents) {
  for (const path of paths) {
    try {
      const response = await fetch(`${baseUrl}${path}`, { headers: { "user-agent": agent }, redirect: "manual" });
      const body = await response.text();
      const canonical = body.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "";
      const meaningful = path === "/robots.txt" || /<h1(?:\s|>)/.test(body);
      console.log(`${agent} ${path} -> ${response.status} canonical=${canonical || "n/a"} meaningful=${meaningful}`);
      if (agent !== "GPTBot" && path !== "/robots.txt" && (response.status !== 200 || !meaningful)) failed = true;
    } catch (error) {
      failed = true;
      console.error(`${agent} ${path} -> ${error.message}`);
    }
  }
}
if (failed) process.exitCode = 1;
