import ServicePage from '@/components/ServicePage';

export const metadata = {
  title: 'BroRent — Шеринг инструментов',
  description: 'Аренда моющих пылесосов, электроинструмента, садового инвентаря',
};

export default function RentPage() {
  return <ServicePage domainId="rent" />;
}
