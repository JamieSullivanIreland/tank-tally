interface Props {
  label: string;
}

const Header = ({ label }: Props) => {
  return <h1>{label}</h1>;
};

export default Header;
