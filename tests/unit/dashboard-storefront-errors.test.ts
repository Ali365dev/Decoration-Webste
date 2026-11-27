import { describe, expect, it } from "vitest";
import { humanizeError } from "../../apps/dashboard/src/views/settings/storefront/errors.js";

describe("humanizeError", () => {
  it("names a field inside a numbered item", () => {
    expect(humanizeError("slides.0.heading: This field is required.", "Top slideshow")).toBe(
      "Top slideshow, slide 1, heading: This field is required.",
    );
  });

  it("names nested menu items", () => {
    expect(humanizeError("items.2.children.0.href: Links must start with / or https://", "Header menu")).toBe(
      "Header menu, item 3, item 1, link: Links must start with / or https://",
    );
  });

  it("names a top-level field and capitalises without a prefix", () => {
    expect(humanizeError("email: Enter a valid email address.")).toBe("Email: Enter a valid email address.");
  });

  it("names a list that is too short", () => {
    expect(humanizeError("slides: Add at least one slide.", "Top slideshow")).toBe("Top slideshow, slides: Add at least one slide.");
  });

  it("leaves a plain message alone", () => {
    expect(humanizeError("Database not configured")).toBe("Database not configured");
  });
});
