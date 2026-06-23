import ServicePage from '@/components/ServicePage';

export const metadata = {
  title: 'BroWash — Химчистка мебели',
  description: 'Химчистка мягкой мебели, матрасов, окон, ковров и салонов авто',
};

export default function WashPage() {
  return <ServicePage domainId="wash" />;
}
