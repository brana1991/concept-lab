# 1. Record architecture decisions

Date: 2022-01-13

## Status

Accepted

## Context

The goal of this document is to record important architecture decisions made regarding the folder structure of the `components` folder in platform redesign initiative. The document explains how the directories follow the principles of Atomic Design, and break down the components into smaller, reusable pieces called atoms, molecules, and organisms.

The document also explains the roles and responsibilities of each level of component, and provides examples of the types of components that fall under each category

## Atoms

- Atoms are the smallest and most basic building blocks of an interface.
- They are the foundation of the component hierarchy and are typically not composed of other components.
- They rather make up more complex components in the system.
- Examples are Text, Button, Link, and Icon.

## Molecules

- Molecules are groups of atoms and/or other molecules that are semantically and functionally related.
- They are considered to be the next level of complexity after atoms and represent the first level of components that have some internal state or logic.
- They are responsible for handling and managing the state of the components that compose them.
- They also handle the layout and positioning of the atoms, and they can have some basic styles to improve the look and feel of the atoms.
- Examples are Accordion, Modal, Popover, Menu, etc...

## Organisms

- Organisms are the most complex components made up of molecules and atoms.
- They provide designers and developers with an important sense of context and serve as distinct patterns that can be used again and again.
- Organisms are mostly focused on handling the layout and overall structure of the interface. They can also have internal state and logic, and can fetch data from external sources.
- It's important to keep in mind that while organisms can handle data fetching internally, it's also a good practice to separate the data-fetching logic from the component if the component is going to be reused in other parts of the application. This way it can be easily reused and the data fetching logic can be handled in another layer, such as a hook or a provider
- Examples are Carousel, Product List Grid, Categories List Grid, Header, Footer, etc...

## Context Conclusion

All three levels of components should be as generic and reusable as possible, so that they can be easily used in multiple contexts without modification. The main purpose of Atomic Design is to facilitate the development of complex UI by breaking it down into smaller, manageable and reusable components.

## Rules

- Atoms should only import other atoms, and should not depend on molecules or organisms. This ensures that atoms remain simple and focused on their specific role.

- Molecules should only import atoms or other molecules, and should not depend on organisms. This ensures that molecules remain focused on a specific functionality and can be easily reused.

- Organisms should import atoms, molecules, and other organisms as needed, but should not depend on pages. This ensures that organisms remain focused on a specific functionality and can be easily reused across different pages.

- Imports should mostly come from module's index file serving as a public interface of the module. By having a single index file that serves as the public interface for a module it's easier to manage changes and updates, and it's clear which components are supposed to be used and which are not
