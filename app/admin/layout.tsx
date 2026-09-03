import type { Metadata } from 'next';
import AdminNav from '../../components/admin/AdminNav';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * This was a passthrough until now, which is why the admin felt like a maze: ten of the
 * thirteen screens had no link out, so every move between them went through the browser
 * back button. The nav is in the layout rather than repeated per page so a new admin
 * screen is reachable the moment it exists.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
