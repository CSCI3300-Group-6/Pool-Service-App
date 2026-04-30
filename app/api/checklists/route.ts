import { db } from "@/lib/db";
import { canViewOps } from "@/lib/permissions";
import { requireApiUser, fail, ok } from "@/lib/api";
import { checklistTemplateSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    // Verifies the user is authenticated for this API route
    const user = await requireApiUser();

    // Checks the user has the correct role to create checklist templates
    if (!canViewOps(user.role)) return fail("Forbidden", 403);

    // Validates the request body against the checklist template schema
    const parsed = checklistTemplateSchema.safeParse(await request.json());
    if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");

    // Creates the checklist template and its items together in a single database write
    // Each item is assigned a sort order based on its position in the array
    const template = await db.checklistTemplate.create({
      data: {
        organizationId: user.organizationId,
        name: parsed.data.name,
        description: parsed.data.description || null,
        items: {
          create: parsed.data.items.map((item, index) => ({
            label: item.label,
            required: item.required,
            sortOrder: index + 1,
          })),
        },
      },
    });

    // Returns the new template ID on success
    return ok({ id: template.id });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to create checklist", 500);
  }
}
