interface AuthFormHeaderProps {
title: string;
description: string;
}

export default function AuthFormHeader({
title,
description,
}: AuthFormHeaderProps) {
return ( <div className="mb-8"> <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
{title} </h1>


  <p className="mt-3 text-sm leading-6 text-ink-500 sm:text-base">
    {description}
  </p>
</div>


);
}
