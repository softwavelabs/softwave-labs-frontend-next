import "./layout.css";

const Layout = ({ children, theme }) => {
  return (
    <div
      sx={{
        pl: [1, 2, 3],
        pr: [1, 2, 3],
        pt: [1, 2, 3],

        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        bg: theme["background"],
      }}
    >
      {children}
    </div>
  );
};

export default Layout;
