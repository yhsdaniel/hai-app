import { Participants } from '../chat/api'
import ButtonContact from './button-contact'

type ContactListProps = {
    participants: Participants[],
    current: number,
    onChoose: (i: number) => void
}

export default function ContactList({
    participants = [],
    current,
    onChoose
}: ContactListProps) {
    const chooseUser = (e: number) => {
        onChoose(e)
    }
    return (
        <li className='overflow-auto'>
            {participants.map((p, i) => (
                p && (
                    <ButtonContact
                        key={i}
                        profilePicture={p.profilePicture ? p.profilePicture : `https://ui-avatars.com/api/?name=${p.username}&background=random&color=white`}
                        contact={p.username}
                        onClick={() => chooseUser(i)}
                        isSelected={current === i}
                    />
                )
            ))}
        </li>
    )
}
