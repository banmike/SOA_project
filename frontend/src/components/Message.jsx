const Message = ({ message }) => {
  const isSuccess = message.includes('thành công');
  return (
    <div
      className={`p-4 mb-4 rounded-lg ${
        isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {message}
    </div>
  );
};

export default Message;