'use client';
import LinkNext from 'next/link';
import { useRouter, usePathname, useParams as useParamsNext, useSearchParams as useSearchParamsNext } from 'next/navigation';
import { useEffect, forwardRef } from 'react';

export const Link = forwardRef<any, any>(({ to, children, ...props }, ref) => {
  return <LinkNext href={to || '#'} ref={ref} {...props}>{children}</LinkNext>;
});

export const NavLink = forwardRef<any, any>(({ to, children, className, style, ...props }, ref) => {
  const pathname = usePathname();
  const isActive = pathname === to;
  const combinedClassName = typeof className === 'function' ? className({ isActive }) : className;
  const combinedStyle = typeof style === 'function' ? style({ isActive }) : style;
  return <LinkNext href={to || '#'} ref={ref} className={combinedClassName} style={combinedStyle} {...props}>{children}</LinkNext>;
});

export const useNavigate = (): ((path: string | number, options?: any) => void) => {
  const router = useRouter();
  return (path: string | number, options?: any) => {
    if (typeof path === 'number') {
      if (path === -1) router.back();
      return;
    }
    if (options && options.replace) {
      router.replace(path as string);
    } else {
      router.push(path as string);
    }
  };
};

export const useLocation = () => {
  const pathname = usePathname();
  const searchParams = useSearchParamsNext();
  return {
    pathname,
    search: searchParams.toString() ? '?' + searchParams.toString() : '',
    hash: '',
    state: null
  };
};

export const useParams = useParamsNext;

export const useSearchParams = () => {
  const searchParams = useSearchParamsNext();
  const router = useRouter();
  const pathname = usePathname();
  
  const setSearchParams = (params) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (params instanceof URLSearchParams) {
       for (const [key, value] of params.entries()) {
         newSearchParams.set(key, value);
       }
    } else {
      Object.keys(params).forEach(key => {
        newSearchParams.set(key, params[key]);
      });
    }
    router.push(pathname + '?' + newSearchParams.toString());
  };
  
  return [searchParams, setSearchParams];
};

export const Navigate = ({ to, replace }) => {
  const router = useRouter();
  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);
  return null;
};
