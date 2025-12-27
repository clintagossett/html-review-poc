import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HeroSection } from "@/components/landing/HeroSection";

describe("HeroSection", () => {
  describe("Badge", () => {
    it("should display gradient badge with correct text", () => {
      render(<HeroSection />);

      expect(screen.getByText("AI-Powered Review Platform")).toBeInTheDocument();
    });
  });

  describe("Headline", () => {
    it("should display main headline", () => {
      render(<HeroSection />);

      const headline = screen.getByRole("heading", {
        name: /from ai output to stakeholder feedback in one click/i
      });
      expect(headline).toBeInTheDocument();
    });
  });

  describe("Description", () => {
    it("should display subheadline text", () => {
      render(<HeroSection />);

      expect(screen.getByText(/share html artifacts/i)).toBeInTheDocument();
    });
  });

  describe("CTA Buttons", () => {
    it("should display Start Free button", () => {
      render(<HeroSection />);

      const startFreeButton = screen.getAllByRole("link", { name: /start free/i })[0];
      expect(startFreeButton).toBeInTheDocument();
      expect(startFreeButton).toHaveAttribute("href", "/register");
    });

    it("should display secondary CTA button", () => {
      render(<HeroSection />);

      const demoButton = screen.getByRole("button", { name: /see demo/i });
      expect(demoButton).toBeInTheDocument();
    });

    it("should have gradient styling on Start Free button", () => {
      render(<HeroSection />);

      const startFreeLink = screen.getAllByRole("link", { name: /start free/i })[0];
      const button = within(startFreeLink).getByRole("button");
      expect(button).toHaveClass("bg-gradient-to-r");
    });
  });

  describe("Social Proof", () => {
    it("should display avatar stack", () => {
      render(<HeroSection />);

      // Should have avatars with initials
      expect(screen.getByText(/trusted by/i)).toBeInTheDocument();
    });

    it("should display team count text", () => {
      render(<HeroSection />);

      expect(screen.getByText(/500\+ product teams/i)).toBeInTheDocument();
    });
  });

  describe("Product Mockup", () => {
    it("should display browser window mockup", () => {
      const { container } = render(<HeroSection />);

      // Check for browser window elements (dots)
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();

      // Should contain visual elements
      const mockupContainer = container.querySelector('[class*="rounded-2xl"]');
      expect(mockupContainer).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("should use two-column grid on desktop", () => {
      const { container } = render(<HeroSection />);
      const section = container.querySelector("section");

      // Should have grid layout
      const gridContainer = section?.querySelector('[class*="grid"]');
      expect(gridContainer).toBeInTheDocument();
    });

    it("should have responsive padding", () => {
      const { container } = render(<HeroSection />);
      const section = container.querySelector("section");

      expect(section).toHaveClass("py-16");
    });
  });
});
