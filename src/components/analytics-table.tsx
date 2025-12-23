import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LinkStats {
  shortUrl: string;
  originalUrl: string;
  totalClicks: number;
  uniqueVisitors: number;
  createdAt: string;
}

interface AnalyticsTableProps {
  data: LinkStats[];
}

export default function AnalyticsTable({ data }: AnalyticsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Short URL</TableHead>
            <TableHead>Original URL</TableHead>
            <TableHead>Total Clicks</TableHead>
            <TableHead>Unique Visitors</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((link) => (
            <TableRow key={link.shortUrl}>
              <TableCell>{link.shortUrl}</TableCell>
              <TableCell className="max-w-xs truncate">{link.originalUrl}</TableCell>
              <TableCell>{link.totalClicks}</TableCell>
              <TableCell>{link.uniqueVisitors}</TableCell>
              <TableCell>{link.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}