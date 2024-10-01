import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { Link, useLocation } from '@tanstack/react-router';
import { PersonIcon } from '@radix-ui/react-icons';

export function NavBar() {
  const location = useLocation();
  return (
    <header className="flex items-center h-20 px-4 shrink-0 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="w-6 h-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link href="#">
            <Logo className="w-6 h-6" />
            <span className="sr-only">Company Logo</span>
          </Link>
          <div className="grid gap-2 py-6">
            <Link
              to="/"
              className="flex items-center w-full py-2 text-lg font-semibold"
            >
              Tasks
            </Link>
            <Link
              to="/images"
              className="flex items-center w-full py-2 text-lg font-semibold"
            >
              Images
            </Link>
            <Link
              to="/about"
              className="flex items-center w-full py-2 text-lg font-semibold"
            >
              About
            </Link>
            <Link
              to="/profile"
              className="flex items-center w-full py-2 text-lg font-semibold"
            >
              Profile
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <Link to="/" className="hidden mr-6 lg:flex">
        <Logo className="w-6 h-6" />
        <span className="sr-only">Company Logo</span>
      </Link>
      <NavigationMenu className="justify-between hidden w-full max-w-full lg:flex">
        <NavigationMenuList>
          <NavigationMenuLink asChild>
            <Link
              to="/"
              data-state={location.pathname === '/' ? 'open' : 'closed'}
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 "
            >
              Tasks
            </Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link
              to="/images"
              data-state={location.pathname === '/images' ? 'open' : 'closed'}
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 "
            >
              Images
            </Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link
              to="/about"
              data-state={location.pathname === '/about' ? 'open' : 'closed'}
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 "
            >
              About
            </Link>
          </NavigationMenuLink>
        </NavigationMenuList>
        <NavigationMenuList>
          <NavigationMenuLink asChild>
            <Link
              to="/profile"
              data-state={location.pathname === '/profile' ? 'open' : 'closed'}
              className="group inline-flex h-max w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 "
            >
              <PersonIcon className="w-6 h-6" />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="512.000000pt"
      height="512.000000pt"
      viewBox="0 0 512.000000 512.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <path
          d="M346 5109 c-165 -27 -308 -175 -336 -346 -16 -97 -12 -935 4 -1014
   25 -115 85 -203 181 -264 76 -49 141 -64 302 -72 l143 -6 0 -847 0 -847 -143
   -6 c-161 -8 -226 -23 -302 -72 -96 -61 -156 -149 -181 -264 -16 -79 -20 -917
   -4 -1014 28 -176 171 -319 345 -347 33 -5 260 -10 505 -10 550 0 584 6 701
   109 103 91 136 178 146 388 l6 143 847 0 847 0 6 -143 c10 -210 43 -297 146
   -388 117 -103 151 -109 701 -109 245 0 472 5 505 10 174 28 317 171 345 347 6
   32 10 258 10 503 0 550 -6 584 -109 701 -91 103 -178 136 -388 146 l-143 6 0
   847 0 847 143 6 c210 10 297 43 388 146 103 117 109 151 109 701 0 245 -5 472
   -10 505 -28 174 -171 317 -347 345 -32 6 -258 10 -503 10 -550 0 -584 -6 -701
   -109 -103 -91 -136 -178 -146 -388 l-6 -143 -847 0 -847 0 -6 143 c-10 210
   -43 297 -146 388 -117 104 -149 109 -711 108 -250 -1 -477 -5 -504 -10z m934
   -844 l0 -425 -425 0 -425 0 0 425 0 425 425 0 425 0 0 -425z m3410 0 l0 -425
   -425 0 -425 0 0 425 0 425 425 0 425 0 0 -425z m-1280 -292 c0 -43 5 -118 10
   -166 17 -162 95 -279 231 -346 70 -34 172 -50 327 -51 l72 0 0 -850 0 -850
   -77 0 c-151 -1 -252 -17 -322 -51 -136 -67 -214 -185 -231 -346 -5 -48 -10
   -123 -10 -165 l0 -78 -850 0 -850 0 0 78 c-1 222 -35 338 -130 432 -94 95
   -210 129 -432 130 l-78 0 0 850 0 850 73 0 c228 1 343 35 437 130 95 94 129
   210 130 433 l0 77 850 0 850 0 0 -77z m-2130 -3118 l0 -425 -425 0 -425 0 0
   425 0 425 425 0 425 0 0 -425z m3410 0 l0 -425 -425 0 -425 0 0 425 0 425 425
   0 425 0 0 -425z"
        />
      </g>
    </svg>
  );
}
