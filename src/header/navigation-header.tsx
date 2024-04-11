type NAVIGATION_HEADER_PROPS = { path: string };

export function NavigationHeader({ path }: NAVIGATION_HEADER_PROPS) {
  /**
   * Header that displays navigation data and used to navigate within explorer
   */

  // TODO: Allow to search, fill header with bar, etc
  return (
    <div className="header">
      <div>
        <div className="header-path-bar">
          <span>{path}</span>
        </div>
      </div>
    </div>
  );
}
