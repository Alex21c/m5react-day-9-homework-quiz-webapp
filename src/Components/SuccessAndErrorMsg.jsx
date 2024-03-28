export default function SuccessAndErrorMsg({stateSuccessAndErrorMsg}){
  return (
    <h2 className={`${stateSuccessAndErrorMsg['style'][stateSuccessAndErrorMsg.msgType]} ${stateSuccessAndErrorMsg.displayNone}`}>
      <span className="font-semibold">{stateSuccessAndErrorMsg.msgType}: </span>
      <span>{stateSuccessAndErrorMsg.msg}</span>
    </h2>
  );
}