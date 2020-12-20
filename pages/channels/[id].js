import Layout from "~/components/Layout";
import Message from "~/components/Message";
import MessageInput from "~/components/MessageInput";
import { useRouter } from "next/router";
import { useStore, addMessage } from "~/lib/Store";
import { useContext, useEffect, useRef } from "react";
import UserContext from "~/lib/UserContext";
import SonWan from "sonwan-ui";
import { motion } from "framer-motion";

const { Card, CardItem } = SonWan;

const ChannelsPage = (props) => {
  const router = useRouter();
  const mountTime = useRef(Date.now());
  const { user, authLoaded, signOut } = useContext(UserContext);
  const messagesEndRef = useRef(null);

  // Redirect if not signed in.
  useEffect(() => {
    if (authLoaded && !user) signOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  // Else load up the page
  const { id: channelId } = router.query;
  const { messages, channels, users } = useStore({ channelId });

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [messages]);

  // Render the channels and messages
  return (
    <Layout channels={channels} activeChannelId={channelId}>
      <div className="relative h-screen">
        <div className="Messages h-full pb-16">
          <div className="p-4 overflow-y-auto">
            {messages.map((x) => {
              console.log(x);
              const isPastMessage = mountTime.current > new Date(x.inserted_at);
              const username = x.author.username.split("@")[0];
              return (
                <motion.div
                  key={x.id}
                  initial={{
                    scale: !isPastMessage ? 0 : 1,
                  }}
                  animate={{
                    scale: 1,
                    transition: {
                      type: "spring",
                      damping: 40,
                      stiffness: 600,
                    },
                  }}
                >
                  <Card>
                    <CardItem
                      title={username}
                      subtitle={x.message}
                      avatar={
                        <img
                          className="w-10 h-10 rounded-full"
                          alt="profile"
                          src={`https://unavatar.now.sh/${x.author.username}`}
                        />
                      }
                    />
                  </Card>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} style={{ height: 0 }} />
          </div>
        </div>
        <div className="p-4 absolute bottom-0 left-0 w-full">
          <MessageInput
            onSubmit={async (text) => addMessage(text, channelId, user)}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ChannelsPage;
