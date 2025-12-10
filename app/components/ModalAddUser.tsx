import React from 'react'

export default function ModalAddUser({ submitParticipants }: { submitParticipants: (e: React.FormEvent<HTMLFormElement>) => void }) {
    return (
        <dialog id="my_modal_1" className="modal">
            <div className="modal-box bg-white text-black shadow-md shadow-purple-300">
                <h3 className="font-bold text-lg">Who are chat do you want ?</h3>
                <form onSubmit={submitParticipants}>
                    <input
                        name="username"
                        className="my-4 p-2 w-full border border-violet-300 focus:border-violet-600 focus:ring-0 outline-none rounded-xl"
                        placeholder="Username / Name"
                    />
                    <button type="submit" className="btn btn-primary rounded-3xl float-right">Add to chat</button>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}
