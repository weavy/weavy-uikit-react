import React from "react";
import classNames from "classnames";
import Presence from "./Presence";
import { getInitials } from "../utils/strings";
import { MembersResult, UserType } from "../types/types";

type AvatarProps = {
  id?: number;
  name?: string;
  src?: string;
  presence?: string;
  size?: number;
  className?: string;
};

export const Avatar = ({
  id,
  src,
  name,
  presence,
  size = 48,
  className,
}: AvatarProps) => {
  const remSize = size / 16;
  let initials;

  if (!src && name) {
    initials = getInitials(name);
  }

  return (
    <div className={classNames("wy-avatar-presence", className)}>
      {src ? (
        <img
          alt=""
          title={name}
          className="wy-avatar"
          height={size}
          width={size}
          src={src}
        />
      ) : (
        <div
          className="wy-avatar wy-avatar-initials"
          style={{ ["--wy-component-avatar-size" as any]: `${remSize}rem` }}
          title={name}
        >
          <span>{initials}</span>
        </div>
      )}

      {presence && id && <Presence id={id} status={presence} />}
    </div>
  );
};

type AvatarGroupProps = {
  user: UserType;
  name?: string;
  members?: MembersResult;
  size?: number;
  className?: string;
};

export const AvatarGroup = ({
  user,
  members,
  name = "",
  size = 48,
}: AvatarGroupProps) => {
  const remSize = size / 16;
  const otherMembers = (members?.data || [])
    .filter((member) => member.id !== user.id)
    .slice(0, 2)
    .reverse();

  const frontMember: UserType | undefined = otherMembers?.shift() || user;
  const backMember: UserType | undefined =
    otherMembers?.shift() || (frontMember !== user ? user : undefined);

  return (
    <div
      className="wy-avatar-group"
      title={name}
      style={{ ["--wy-component-avatar-size" as any]: `${remSize}rem` }}
    >
      <Avatar
        src={backMember?.avatar_url}
        name={backMember?.display_name}
        size={(size * 2) / 3}
      ></Avatar>
      <Avatar
        src={frontMember.avatar_url}
        name={frontMember.display_name}
        size={(size * 2) / 3}
      ></Avatar>
    </div>
  );
};

export default Avatar;
