"use client";
import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import {
  useAuth,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/nextjs";
import Link from "next/link";
import ModeToggle from "./ModeToggle";

const MobileNavbar = ({ username }: { username: string | undefined }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isSignedIn } = useAuth();
  return (
    <div className="flex md:hidden items-center space-x-2">
      <ModeToggle variant="ghost" />
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mt-6">
            <SheetClose asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 justify-start"
                asChild
              >
                <Link href="/">
                  <HomeIcon className="w-4 h-4" />
                  Home
                </Link>
              </Button>
            </SheetClose>

            {isSignedIn ? (
              <>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start"
                    asChild
                  >
                    <Link href="/notifications">
                      <BellIcon className="w-4 h-4" />
                      Notifications
                    </Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start"
                    asChild
                  >
                    <Link href={`/profile/${username}`}>
                      <UserIcon className="w-4 h-4" />
                      Profile
                    </Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <SignOutButton>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-3 justify-start w-full"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      Logout
                    </Button>
                  </SignOutButton>
                </SheetClose>
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="default" className="w-full">
                    Log In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="default" className="w-full">
                    Sign Up
                  </Button>
                </SignUpButton>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;
