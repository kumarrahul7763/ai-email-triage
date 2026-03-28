const ResultCard = ({ data }) => {
  return (
    <div className="border p-4 mt-4 bg-gray-100">
      <h2>Result</h2>
      <p><b>Category:</b> {data.category}</p>
      <p><b>Priority:</b> {data.priority}</p>
      <p><b>Department:</b> {data.department}</p>
      <p><b>Reply:</b> {data.reply}</p>
    </div>
  );
};

export default ResultCard;