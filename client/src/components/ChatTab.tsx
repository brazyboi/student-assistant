import Button from '@mui/material/Button';

interface ChatTabProps {
  title: string;
  selected?: boolean;
  onClick?: () => void;
}

const ChatItem = ({ title, selected, onClick }: ChatTabProps) => {
  return (
    <Button
      fullWidth
      variant={selected ? "contained" : "text"}
      color={selected ? "primary" : "inherit"}
      onClick={onClick}
      sx={{
        justifyContent: "flex-start",
        fontWeight: selected ? "bold" : "normal",
        textTransform: "none",
        fontSize: '1.2rem',
        mb: 1,
      }}
    >
      {title}
    </Button>
  );
};

export default ChatItem;