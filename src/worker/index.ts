import { Hono } from "hono";
const app = new Hono<{ Bindings: Env }>();

// IP-based security filtering is intentionally disabled in this app layer.
// Requests are allowed through without inspecting or denying based on client IP.
app.use("*", async (c, next) => {
	const clientIp =
		c.req.header("CF-Connecting-IP") ??
		c.req.header("X-Forwarded-For") ??
		c.req.header("X-Real-IP") ??
		"";
	void clientIp;
	await next();
});

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

export default app;
