import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GenreDropdownProps {
  genres: string[];
  value: string;
  onChange: (value: string) => void;
}

export function GenreDropdown({ genres, value, onChange }: GenreDropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="All genres" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All genres</SelectItem>
        {genres.map((genre) => (
          <SelectItem key={genre} value={genre}>
            {genre.replace(/-/g, ' ')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
