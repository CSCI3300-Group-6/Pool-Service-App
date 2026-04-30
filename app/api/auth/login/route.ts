import { loginSchema } from "@/lib/validation";
import { authenticateUser, createSession, getSessionCookieOptions, SESSION_COOKIE } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

export async function POST(request: Request) {
  try {
    // Parses the request body as JSON
    const body = await request.json();

    // Validates the email and password against the login schema
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Invalid credentials");
    }

    // Checks the credentials against the database
    const user = await authenticateUser(parsed.data.email, parsed.data.password);
    if (!user) {
      return fail("Invalid email or password", 401);
    }

    // Creates a new session for the user and sets it as a cookie on the response
    const session = await createSession(user.id);
    const response = ok({ success: true });
    response.cookies.set(SESSION_COOKIE, session.token, getSessionCookieOptions(session.expiresAt));
    return response;
  } catch {
    // Returns a 500 if anything unexpected goes wrong during sign in
    return fail("Unable to sign in", 500);
  }
}
