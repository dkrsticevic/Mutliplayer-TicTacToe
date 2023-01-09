import "./Cell.css";

const Cell = ({ handleCellClick, handleHover, id, text }) => {
  return (
    <div id={id} className="cell" onClick={handleCellClick} onHover={handleHover}>
      {text}
    </div>
  );
};

export default Cell;