import { Breadcrumb } from 'react-bootstrap';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getServiceById } from '../api/servicesApi';

type Crumb = { label: string; path?: string; active?: boolean };

function Breadcrumbs() {
  const location = useLocation();
  const params = useParams();
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);

  useEffect(() => {
    const build = async () => {
      const parts = location.pathname.split('/').filter(Boolean);
      const list: Crumb[] = [];
      list.push({ label: 'Главная', path: '/' });
      if (parts[0] === 'astronomy') {
        list.push({ label: 'Астрономия', path: '/astronomy' });
      }
      if (parts[0] === 'day_details' && params.id) {
        list.push({ label: 'Астрономия', path: '/astronomy' });
        try {
          const item = await getServiceById(params.id);
          list.push({ label: item ? item.date : `День #${params.id}`, active: true });
        } catch {
          list.push({ label: `День #${params.id}`, active: true });
        }
      } else if (parts.length === 1 && parts[0] === 'astronomy') {
        list[list.length - 1].active = true;
      } else if (parts.length === 0) {
        list[list.length - 1].active = true;
      }
      setCrumbs(list);
    };
    build();
  }, [location.pathname, params.id]);

  return (
    <Breadcrumb className="mb-3">
      {crumbs.map((c, idx) => (
        <Breadcrumb.Item key={idx} active={c.active} linkAs={c.path ? Link : undefined} linkProps={c.path ? { to: c.path } : undefined}>
          {c.label}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}

export default Breadcrumbs;


