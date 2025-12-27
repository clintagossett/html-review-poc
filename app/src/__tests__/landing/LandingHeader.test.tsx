import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LandingHeader } from "@/components/landing/LandingHeader";

describe("LandingHeader", () => {
  describe("Layout", () => {
    it("should render the header with logo", () => {
      render(<LandingHeader />);

      // Logo should be present (MessageSquare icon in gradient background)
      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("should display 'Artifact Review' text", () => {
      const { container } = render(<LandingHeader />);
      const header = container.querySelector("header");

      expect(header).toBeInTheDocument();
      expect(within(header!).getByText("Artifact Review")).toBeInTheDocument();
    });
  });

  describe("Navigation Links", () => {
    it("should display Features link", () => {
      const { container } = render(<LandingHeader />);
      const nav = container.querySelector("nav");

      const featuresLink = within(nav!).getByRole("link", { name: /features/i });
      expect(featuresLink).toBeInTheDocument();
      expect(featuresLink).toHaveAttribute("href", "#features");
    });

    it("should display Pricing link", () => {
      const { container } = render(<LandingHeader />);
      const nav = container.querySelector("nav");

      const pricingLink = within(nav!).getByRole("link", { name: /pricing/i });
      expect(pricingLink).toBeInTheDocument();
      expect(pricingLink).toHaveAttribute("href", "#pricing");
    });

    it("should display FAQ link", () => {
      const { container } = render(<LandingHeader />);
      const nav = container.querySelector("nav");

      const faqLink = within(nav!).getByRole("link", { name: /faq/i });
      expect(faqLink).toBeInTheDocument();
      expect(faqLink).toHaveAttribute("href", "#faq");
    });
  });

  describe("CTA Buttons", () => {
    it("should display Sign In button linking to /login", () => {
      const { container } = render(<LandingHeader />);
      const header = container.querySelector("header");

      const signInButton = within(header!).getByRole("link", { name: /sign in/i });
      expect(signInButton).toBeInTheDocument();
      expect(signInButton).toHaveAttribute("href", "/login");
    });

    it("should display Start Free button linking to /register", () => {
      const { container } = render(<LandingHeader />);
      const header = container.querySelector("header");

      const startFreeButton = within(header!).getByRole("link", { name: /start free/i });
      expect(startFreeButton).toBeInTheDocument();
      expect(startFreeButton).toHaveAttribute("href", "/register");
    });
  });

  describe("Responsive Behavior", () => {
    it("should have navigation links with responsive classes", () => {
      const { container } = render(<LandingHeader />);
      const nav = container.querySelector("nav");

      // Navigation should have hidden class on mobile
      expect(nav).toHaveClass("hidden", "md:flex");
    });
  });

  describe("Sticky Positioning", () => {
    it("should have sticky positioning", () => {
      const { container } = render(<LandingHeader />);
      const header = container.querySelector("header");

      expect(header).toHaveClass("sticky", "top-0");
    });
  });
});
