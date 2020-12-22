import Link from "next/link";
import { useContext } from "react";
import UserContext from "~/lib/UserContext";
import { addChannel, useStore } from "~/lib/Store";

import SonWan from "sonwan-ui";

const { ListItem, Switch } = SonWan;

export default function Layout(props) {
  const { users } = useStore({ channelId: 1 });
  const { user, signOut } = useContext(UserContext);

  const currentUser = users?.get(user);
  const username = currentUser?.username.split("@")[0];

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  };

  const newChannel = async () => {
    const slug = prompt("Please enter your name");
    if (slug) {
      addChannel(slugify(slug));
    }
  };

  return (
    <div className=" h-screen w-screen bg-light-100 dark:bg-dark-900">
      <main className="main flex container mx-auto max-w-screen-lg">
        {/* Sidebar */}
        <nav
          className="w-0 sm:w-64 bg-light-100 dark:bg-dark-900 text-black overflow-scroll"
          style={{ maxHeight: "100vh" }}
        >
          <div className="p-4">
            <div className="bg-white dark:bg-dark-500 flex flex-row p-4 rounded-xl text-sm mb-4 items-center space-x-4">
              <img
                className="w-10 h-10 rounded-full"
                alt="profile"
                src={`https://unavatar.now.sh/${currentUser?.username}`}
              />
              <div className="text-black dark:text-white text-sm font-semibold">
                {username}
              </div>
            </div>

            <div className="bg-white dark:bg-dark-500 flex flex-col p-4 rounded-xl text-sm mb-4">
              <ListItem
                title="🌙 &nbsp; Dark Mode"
                action={
                  <Switch
                    name="darkmode"
                    onChange={(value) => {
                      if (value) {
                        document.querySelector("html").classList.add("dark");
                      } else {
                        document.querySelector("html").classList.remove("dark");
                      }
                    }}
                  />
                }
              />
              <ListItem
                title="🔒 &nbsp; Log Out"
                action={
                  <Switch
                    name="logout"
                    onChange={(value) => {
                      if (value) {
                        signOut();
                      }
                    }}
                  />
                }
              />
            </div>

            <ul className="channel-list bg-white dark:bg-dark-500 p-4 rounded-xl text-sm mb-4  ">
              <h4 className="text-sm mb-4 text-black dark:text-white opacity-50">
                Channels
              </h4>
              {props.channels.map((x) => (
                <SidebarItem
                  channel={x}
                  key={x.id}
                  isActiveChannel={x.id === props.activeChannelId}
                />
              ))}
            </ul>
          </div>
        </nav>

        {/* Messages */}
        <div className="flex-1 bg-light-100 dark:bg-dark-900 h-screen">
          {props.children}
        </div>
      </main>
    </div>
  );
}

const SidebarItem = ({ channel, isActiveChannel }) => (
  <>
    <Link href="/channels/[id]" as={`/channels/${channel.id}`}>
      <li className="p-2 rounded-xl hover:bg-light-100 dark:hover:bg-dark-900 cursor-pointer text-black dark:text-white">
        <a className={isActiveChannel ? "font-bold" : ""}>{channel.slug}</a>
      </li>
    </Link>
  </>
);
