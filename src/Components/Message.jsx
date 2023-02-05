

export default function (props) {

    const { kind, content, timestamp, sender, previous, senderId } = props;

    return (
        <div className="messageContainer" style={{ alignItems: kind ? 'flex-end' : 'flex-start' }}>
            <div className="messageBubble" style={{ background: kind ? '#025C4C' : '#373737' }}>
                {((previous != null && previous.sender != senderId) || (previous == null)) &&
                    <>
                        <div style={{ minWidth: '150px', display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                            <h1 style={{ fontWeight: 'bolder' }}>{sender}</h1>
                            <label>at {new Date(timestamp).toLocaleString()}</label>
                        </div>
                        <hr style={{ background: 'black', width: '100%', marginBottom: '0.5rem' }}></hr>
                    </>
                }
                <p>{content}</p>
            </div>
        </div>
    )
}