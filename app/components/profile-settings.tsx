import UploadImage from "@/lib/upload-image";

export default function ProfileSettings({ serverUser, profilePicture }: { serverUser: any, profilePicture: any }) {
    return (
        <div className="drawer drawer-end">
            <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
            <div className="drawer-side">
                <label htmlFor="my-drawer-5" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="menu bg-base-200 min-h-full w-96 p-4 flex gap-6">
                    <header className="text-xl py-4 font-bold">Profile</header>
                    <div className="avatar">
                        <UploadImage serverUser={serverUser} />
                        <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">
                            <img src={profilePicture ? profilePicture : `https://ui-avatars.com/api/?name=${serverUser?.username}&background=random&color=white`} />
                        </div>
                    </div>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Name</legend>
                        <input type="text" className="input rounded-xl" placeholder="Name" />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Email</legend>
                        <input type="text" className="input rounded-xl" placeholder="Your email" />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Phone</legend>
                        <input type="text" className="input rounded-xl" placeholder="Your phone number" />
                    </fieldset>
                    <div className="w-full mt-auto flex justify-end">
                        <button className="btn btn-primary">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
