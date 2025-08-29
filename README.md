# Roadmapper - Project Roadmap & Idea Management

![Roadmapper Screenshot](https://i.imgur.com/u74Yg4m.png)

Roadmapper is a production-ready, client-side web application for project management, roadmapping, and idea note-taking. It's designed with a clean, minimalistic, and highly functional UI inspired by modern tools like Notion and Linear.

This application runs entirely in your browser, using `localStorage` to persist all your data. There is no backend, no database, and no need for user authentication, making it a perfect tool for personal projects or quick-start team planning.

## ✨ Key Features

- **Project Management**: Create, edit, and delete projects with titles, descriptions, and custom logos.
- **Roadmap & Ideas**: Each project has its own roadmap board to manage ideas.
- **Rich Text Descriptions**: Use Markdown (`**bold**`, `*italic*`, `[links](...)`) in your idea descriptions for better formatting.
- **Idea Categorization**:
  - **Type**: Assign a type to each idea (`Add`, `Edit`, `Remove`).
  - **Priority**: Prioritize ideas with `Low`, `Medium`, `High`, or `Urgent` levels.
  - **Due Dates**: Set optional due dates, with visual indicators for overdue items.
- **Advanced Task Management**:
  - **Pinning**: Mark ideas as "To-do first" to pin them to the top of the list.
  - **Status Tracking**: Mark ideas as "Done" to track completion.
  - **Archiving**: Archive ideas to declutter your board without permanently deleting them.
- **Powerful Filtering & Sorting**:
  - Filter ideas by type (`Add`, `Edit`, `Remove`) or view `Archived` items.
  - Sort ideas by creation date, priority, name (A-Z), or due date.
- **Intuitive UI**:
  - **Dashboard Views**: Switch between a main project dashboard and a "Recent Ideas" feed.
  - **Search**: Instantly search for projects and ideas.
  - **Responsive Design**: A seamless experience on desktop and mobile devices.
- **Customization**:
  - **Light & Dark Themes**: Toggle between themes with a beautiful, animated switch.
  - **Persistent Settings**: Your theme preference is saved locally.
- **Zero Backend**: All data is securely stored in your browser's `localStorage`. No sign-up required.

## 📸 Screenshots

Here's a preview of the LoanDash application:

![Roadmapper Home Page - Dark Mode](https://raw.githubusercontent.com/hamzamix/Roadmapper/refs/heads/main/Screenshots/project.png)
![Roadmapper Home Page - Dark Mode](https://raw.githubusercontent.com/hamzamix/Roadmapper/refs/heads/main/Screenshots/project-ideas.png)

* [View More Screenshots](https://github.com/hamzamix/Roadmapper/tree/main/Screenshots)


## 🛠️ Technology Stack

- **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Storage**: Browser `localStorage`
- **Build Tool**: [Vite](https://vitejs.dev/) (or a similar modern bundler)

## 🚀 Run Locally

**Prerequisites:**
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

Follow these steps to get the application running on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/roadmapper.git
    cd roadmapper
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```

4.  **Open the application:**
    Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

**Note:** This project is a pure front-end application and does **not** require any `.env` files or API keys to run.

## 🤝 Contributing

Contributions are welcome! If you have a feature request, bug report, or want to contribute to the code, please feel free to:

-   Open an issue to discuss your ideas.
-   Fork the repository and submit a pull request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
